// NumberField logic (framework-free, so it runs without a browser).
// Parsing, formatting, stepping and clamping are pure functions in src/components/number-field-logic.ts.
// The keyboard and ARIA behaviour of the component itself is in tests/keyboard.mjs.
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }
const eq = (got, want, msg) => check(Object.is(got, want), `${msg}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`)

let m = null
try { m = await import('../src/components/number-field-logic.ts') } catch (e) { check(false, `src/components/number-field-logic.ts cannot be imported: ${e.message.split('\n')[0]}`) }

if (m) {
  const { clampNumber, roundToStep, stepNumber, parseNumber, formatNumber, isPartialNumber } = m

  // clampNumber
  eq(clampNumber(5, 0, 10), 5, 'clamp inside the range')
  eq(clampNumber(-3, 0, 10), 0, 'clamp below min')
  eq(clampNumber(99, 0, 10), 10, 'clamp above max')
  eq(clampNumber(99, undefined, undefined), 99, 'clamp without bounds')

  // roundToStep: no floating point noise, aligned to min
  eq(roundToStep(0.1 + 0.2, 0.1, undefined), 0.3, '0.1 + 0.2 rounds to 0.3')
  eq(roundToStep(7, 5, 0), 5, 'snaps to the nearest step from min')
  eq(roundToStep(8, 5, 0), 10, 'snaps up when closer')
  eq(roundToStep(7, 5, 1), 6, 'steps are counted from min, not from zero')
  eq(roundToStep(12.345, 0.01, undefined), 12.35, 'two decimals of precision')

  // stepNumber: arrows move by step, large steps by largeStep, always clamped
  const o = { step: 1, largeStep: 10, min: 0, max: 20 }
  eq(stepNumber(5, 1, o), 6, 'up by step')
  eq(stepNumber(5, -1, o), 4, 'down by step')
  eq(stepNumber(5, 1, { ...o, large: true }), 15, 'up by large step')
  eq(stepNumber(5, -1, { ...o, large: true }), 0, 'large step down stops at min')
  eq(stepNumber(20, 1, o), 20, 'does not pass max')
  eq(stepNumber(0, -1, o), 0, 'does not pass min')
  eq(stepNumber(0.2, 1, { step: 0.1 }), 0.3, 'decimal steps carry no float noise')
  eq(stepNumber(null, 1, { step: 1 }), 1, 'empty + up starts at one step when unbounded')
  eq(stepNumber(null, -1, { step: 1 }), -1, 'empty + down starts at minus one step when unbounded')
  eq(stepNumber(null, 1, { step: 1, min: 3 }), 3, 'empty + up starts at min')
  eq(stepNumber(null, -1, { step: 1, max: 9 }), 9, 'empty + down starts at max')
  eq(stepNumber(6.5, 1, { step: 5, min: 0 }), 10, 'off-step value snaps to the next step')
  eq(stepNumber(6.5, -1, { step: 5, min: 0 }), 5, 'off-step value snaps to the previous step')

  // parseNumber: understands the locale's separators; anything else is null
  eq(parseNumber('1234', 'en-US'), 1234, 'integer')
  eq(parseNumber('1,234.5', 'en-US'), 1234.5, 'en-US grouping and decimal')
  eq(parseNumber('1.234,5', 'es-CO'), 1234.5, 'es-CO grouping and decimal')
  eq(parseNumber('3,5', 'es-CO'), 3.5, 'es-CO decimal comma')
  eq(parseNumber('-7', 'en-US'), -7, 'negative')
  eq(parseNumber('−7', 'en-US'), -7, 'typographic minus')
  eq(parseNumber('  42 ', 'en-US'), 42, 'surrounding spaces')
  eq(parseNumber('', 'en-US'), null, 'empty is null')
  eq(parseNumber('-', 'en-US'), null, 'lone minus is null')
  eq(parseNumber('abc', 'en-US'), null, 'letters are null')
  eq(parseNumber('12abc', 'en-US'), null, 'trailing letters are null')
  eq(parseNumber('1.2.3', 'en-US'), null, 'two decimal separators are null')
  eq(parseNumber('12%', 'en-US', { style: 'percent' }), 0.12, 'percent text becomes a fraction')
  eq(parseNumber('$1,250.50', 'en-US', { style: 'currency', currency: 'USD' }), 1250.5, 'currency symbol is ignored')

  // formatNumber
  eq(formatNumber(1234.5, 'en-US'), '1,234.5', 'en-US format')
  eq(formatNumber(1234.5, 'es-CO'), '1.234,5', 'es-CO format')
  eq(formatNumber(null, 'en-US'), '', 'null formats as empty')
  eq(formatNumber(0.12, 'en-US', { style: 'percent' }), '12%', 'percent format')
  eq(formatNumber(3, 'en-US', { minimumFractionDigits: 2 }), '3.00', 'fraction digits')
  eq(parseNumber(formatNumber(1234567.89, 'es-CO'), 'es-CO'), 1234567.89, 'format then parse round-trips')

  // isPartialNumber: what the field lets you type before it is a number
  eq(isPartialNumber('', 'en-US'), true, 'empty can be typed')
  eq(isPartialNumber('-', 'en-US'), true, 'a minus can start a negative')
  eq(isPartialNumber('1.', 'en-US'), true, 'a trailing decimal separator is allowed while typing')
  eq(isPartialNumber('1,', 'es-CO'), true, 'es-CO trailing comma while typing')
  eq(isPartialNumber('12', 'en-US'), true, 'digits')
  eq(isPartialNumber('1a', 'en-US'), false, 'letters are rejected')
  eq(isPartialNumber('1..2', 'en-US'), false, 'two decimal separators are rejected')
  eq(isPartialNumber('-', 'en-US', { min: 0 }), false, 'a minus is rejected when min is not negative')
  eq(isPartialNumber('.5', 'en-US', { maxFractionDigits: 0 }), false, 'decimals are rejected for integers')
}

if (failures.length) {
  console.error(`✗ ${failures.length} NumberField logic check(s) failed:\n` + failures.map((f) => `  - ${f}`).join('\n'))
  process.exit(1)
}
console.log('✓ NumberField logic: clamp, step, parse, format and partial input')
