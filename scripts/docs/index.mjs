import { actions } from './actions.mjs'
import { forms } from './forms.mjs'
import { selection } from './selection.mjs'
import { feedback } from './feedback.mjs'
import { navigation } from './navigation.mjs'
import { overlays } from './overlays.mjs'
import { layout } from './layout.mjs'
import { data } from './data.mjs'
import { dates } from './dates.mjs'

export const content = { ...actions, ...forms, ...selection, ...feedback, ...navigation, ...overlays, ...layout, ...data, ...dates }
