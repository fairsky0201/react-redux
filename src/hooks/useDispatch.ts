import type { Context } from 'react'
import type { Action, Dispatch, UnknownAction } from 'redux'

import type { ReactReduxContextValue } from '../components/Context'
import { ReactReduxContext } from '../components/Context'
import { createStoreHook, useStore as useDefaultStore } from './useStore'

export interface UseDispatch {
  <
    AppDispatch extends Dispatch<Action> = Dispatch<UnknownAction>
  >(): AppDispatch
  withTypes: <AppDispatch extends Dispatch<Action>>() => () => AppDispatch
}
// export interface UseDispatch<
//   DispatchType extends Dispatch<UnknownAction> = Dispatch<UnknownAction>
// > {
//   <AppDispatch extends DispatchType = DispatchType>(): AppDispatch
//   withTypes: <
//     OverrideDispatchType extends DispatchType
//   >() => UseDispatch<OverrideDispatchType>
// }

/**
 * Hook factory, which creates a `useDispatch` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useDispatch` hook bound to the specified context.
 */
export function createDispatchHook<
  S = unknown,
  A extends Action<string> = UnknownAction
  // @ts-ignore
>(context?: Context<ReactReduxContextValue<S, A> | null> = ReactReduxContext) {
  const useStore =
    // @ts-ignore
    context === ReactReduxContext ? useDefaultStore : createStoreHook(context)

  const useDispatch = <
    AppDispatch extends Dispatch<A> = Dispatch<A>
  >(): AppDispatch => {
    const store = useStore()
    // @ts-ignore
    return store.dispatch
  }

  Object.assign(useDispatch, {
    withTypes: () => useDispatch,
  })

  return useDispatch as UseDispatch
}

/**
 * A hook to access the redux `dispatch` function.
 *
 * @returns {any|function} redux store's `dispatch` function
 *
 * @example
 *
 * import React, { useCallback } from 'react'
 * import { useDispatch } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   const increaseCounter = useCallback(() => dispatch({ type: 'increase-counter' }), [])
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={increaseCounter}>Increase counter</button>
 *     </div>
 *   )
 * }
 */
export const useDispatch = /*#__PURE__*/ createDispatchHook()
