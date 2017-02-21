import { watchApiAsync, watchStepActionAsync } from './watchs'
import { watchFetchAPI } from './watchFetchAPI'

export default function* rootSaga() {
  yield [
    watchApiAsync(),
    watchStepActionAsync(),
    watchFetchAPI()
  ]
}
