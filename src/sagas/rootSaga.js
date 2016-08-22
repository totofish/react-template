import { watchApiAsync, watchStepActionAsync } from './watchs'

export default function* rootSaga() {
  yield [
    watchApiAsync(),
    watchStepActionAsync()
  ]
}
