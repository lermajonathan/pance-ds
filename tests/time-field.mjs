// TimeField logic (framework-free, so it runs without a browser).
// The value is always a 24-hour "HH:mm" string (or null when empty), like dates are ISO strings:
// no Date objects, no time-zone drift. The text the person sees follows the locale (12 h or 24 h).
// Parsing, formatting, stepping and clamping are pure functions in src/components/time-field-logic.ts.
// The keyboard and ARIA behaviour of the component itself is in tests/keyboard.mjs.
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }
const eq = (got, want, msg) => check(Object.is(got, want), `${msg}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`)

let m = null
try { m = await import('../src/components/time-field-logic.ts') } catch (e) { check(false, `src/components/time-field-logic.ts cannot be imported: ${e.message.split('\n')[0]}`) }

if (m) {
  const { isISOTime, toMinutes, fromMinutes, clampTime, uses12Hour, formatTime, parseTime, stepTime, isPartialTime, segmentAt } = m

  // isISOTime: a real clock time written as HH:mm
  eq(isISOTime('00:00'), true, 'midnight is valid')
  eq(isISOTime('23:59'), true, 'last minute of the day is valid')
  eq(isISOTime('24:00'), false, '24:00 is not valid')
  eq(isISOTime('12:60'), false, '60 minutes is not valid')
  eq(isISOTime('9:05'), false, 'hours need two digits')
  eq(isISOTime('09:05:30'), false, 'seconds are not part of the value')
  eq(isISOTime(null), false, 'null is not a time')

  // toMinutes / fromMinutes
  eq(toMinutes('00:00'), 0, 'midnight is minute 0')
  eq(toMinutes('13:45'), 825, '13:45 is minute 825')
  eq(fromMinutes(825), '13:45', 'minute 825 is 13:45')
  eq(fromMinutes(0), '00:00', 'minute 0 is 00:00')
  eq(fromMinutes(1439), '23:59', 'last minute')

  // clampTime
  eq(clampTime('08:00', '09:00', '17:00'), '09:00', 'clamp below min')
  eq(clampTime('18:30', '09:00', '17:00'), '17:00', 'clamp above max')
  eq(clampTime('12:00', '09:00', '17:00'), '12:00', 'clamp inside the range')
  eq(clampTime('12:00', undefined, undefined), '12:00', 'clamp without bounds')

  // uses12Hour: decided by the locale, not by the browser's clock settings
  eq(uses12Hour('en-US'), true, 'en-US is 12 h')
  eq(uses12Hour('es-CO'), true, 'es-CO is 12 h')
  eq(uses12Hour('es-ES'), false, 'es-ES is 24 h')
  eq(uses12Hour('de-DE'), false, 'de-DE is 24 h')
  eq(uses12Hour('en-GB'), false, 'en-GB is 24 h')

  // formatTime: what the person reads
  eq(formatTime('00:05', 'es-ES'), '00:05', '24 h keeps two digits')
  eq(formatTime('13:45', 'es-ES'), '13:45', '24 h afternoon')
  check(/^1:45\s?(p\.?\s?m\.?|PM)$/i.test(formatTime('13:45', 'en-US').replace(/[  ]/g, ' ')), `12 h afternoon reads 1:45 PM: got ${JSON.stringify(formatTime('13:45', 'en-US'))}`)
  check(/^12:05\s?(a\.?\s?m\.?|AM)$/i.test(formatTime('00:05', 'en-US').replace(/[  ]/g, ' ')), `12 h midnight reads 12:05 AM: got ${JSON.stringify(formatTime('00:05', 'en-US'))}`)
  eq(formatTime(null, 'en-US'), '', 'empty value formats to empty text')

  // parseTime: understands what people type; anything else is null
  eq(parseTime('13:45', 'es-ES'), '13:45', '24 h text')
  eq(parseTime('1345', 'es-ES'), '13:45', 'four digits without colon')
  eq(parseTime('945', 'es-ES'), '09:45', 'three digits without colon')
  eq(parseTime('9', 'es-ES'), '09:00', 'a lone hour means on the hour')
  eq(parseTime('9:5', 'es-ES'), '09:05', 'one-digit minutes')
  eq(parseTime('1:45 pm', 'en-US'), '13:45', '12 h with pm')
  eq(parseTime('1:45 PM', 'en-US'), '13:45', '12 h uppercase')
  eq(parseTime('1:45 p. m.', 'es-CO'), '13:45', 'Spanish p. m. with dots and spaces')
  eq(parseTime('12:30 am', 'en-US'), '00:30', '12 am is just after midnight')
  eq(parseTime('12:30 pm', 'en-US'), '12:30', '12 pm is just after noon')
  eq(parseTime('9:30', 'en-US'), '09:30', '12 h locale without suffix reads as typed')
  eq(parseTime('  7:05  ', 'en-US'), '07:05', 'surrounding spaces')
  eq(parseTime('25:00', 'es-ES'), null, 'hour out of range')
  eq(parseTime('12:75', 'es-ES'), null, 'minutes out of range')
  eq(parseTime('13:00 pm', 'en-US'), null, '13 with pm is nonsense')
  eq(parseTime('abc', 'en-US'), null, 'letters are not a time')
  eq(parseTime('', 'en-US'), null, 'empty text is null')

  // stepTime: arrows move one segment; always inside [min, max]
  const o = { step: 15, min: '00:00', max: '23:59' }
  eq(stepTime('10:00', 'minute', 1, o), '10:15', 'minutes up by step')
  eq(stepTime('10:00', 'minute', -1, o), '09:45', 'minutes down borrow from the hour')
  eq(stepTime('10:50', 'minute', 1, { ...o, step: 1 }), '10:51', 'minutes step of one')
  eq(stepTime('10:20', 'minute', 1, o), '10:30', 'off-grid minutes land on the next step')
  eq(stepTime('10:20', 'minute', -1, o), '10:15', 'off-grid minutes land on the previous step')
  eq(stepTime('10:30', 'hour', 1, o), '11:30', 'hour up keeps the minutes')
  eq(stepTime('10:30', 'hour', -1, o), '09:30', 'hour down keeps the minutes')
  eq(stepTime('23:30', 'hour', 1, o), '00:30', 'hour wraps around midnight')
  eq(stepTime('00:30', 'hour', -1, o), '23:30', 'hour wraps backwards')
  eq(stepTime('09:45', 'minute', 1, { step: 15, min: '09:00', max: '10:00' }), '10:00', 'stops at max')
  eq(stepTime('10:00', 'minute', 1, { step: 15, min: '09:00', max: '10:00' }), '10:00', 'does not pass max')
  eq(stepTime('09:00', 'minute', -1, { step: 15, min: '09:00', max: '10:00' }), '09:00', 'does not pass min')
  eq(stepTime('11:30', 'period', 1, o), '23:30', 'AM/PM toggles by twelve hours')
  eq(stepTime('23:30', 'period', 1, o), '11:30', 'PM/AM toggles back')
  eq(stepTime(null, 'hour', 1, o), '00:00', 'empty + up starts at min')
  eq(stepTime(null, 'hour', -1, o), '23:59', 'empty + down starts at max')
  eq(stepTime(null, 'minute', 1, { step: 15, min: '09:00', max: '17:00' }), '09:00', 'empty starts at min when bounded')

  // isPartialTime: what a person may be in the middle of typing
  eq(isPartialTime('', 'en-US'), true, 'empty is allowed')
  eq(isPartialTime('1', 'en-US'), true, 'one digit')
  eq(isPartialTime('1:', 'en-US'), true, 'hour and colon')
  eq(isPartialTime('1:4', 'en-US'), true, 'half a minute')
  eq(isPartialTime('1:45 p', 'en-US'), true, 'half a suffix')
  eq(isPartialTime('1:45 pm', 'en-US'), true, 'full time with suffix')
  eq(isPartialTime('12', 'es-ES'), true, 'two digits')
  eq(isPartialTime('123456', 'es-ES'), false, 'too many digits')
  eq(isPartialTime('1:456', 'es-ES'), false, 'three minute digits')
  eq(isPartialTime('x', 'en-US'), false, 'letters cannot start a time')
  eq(isPartialTime('1::', 'en-US'), false, 'two colons')

  // segmentAt: which part of the text the caret is in ("1:45 PM", "13:45")
  eq(segmentAt('1:45 PM', 0), 'hour', 'caret before the hour')
  eq(segmentAt('1:45 PM', 1), 'hour', 'caret right after the hour digit')
  eq(segmentAt('1:45 PM', 2), 'minute', 'caret right after the colon')
  eq(segmentAt('1:45 PM', 4), 'minute', 'caret at the end of the minutes')
  eq(segmentAt('1:45 PM', 5), 'period', 'caret on the space before AM/PM')
  eq(segmentAt('1:45 PM', 7), 'period', 'caret at the very end of a 12 h time')
  eq(segmentAt('13:45', 1), 'hour', '24 h hour')
  eq(segmentAt('13:45', 5), 'minute', '24 h caret at the end is the minutes')
  eq(segmentAt('', 0), 'hour', 'empty text starts on the hour')
  eq(segmentAt('12', 2), 'hour', 'text without a colon is all hour')
}

if (failures.length) {
  console.error(`✗ time-field: ${failures.length} failing`)
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log('✓ time-field: all checks passed')
