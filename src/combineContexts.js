import reduceAsync from './lib/reduceAsync'

async function combineContexts (modules, initialContext) {
  const contexts = modules
    .filter(module => module.context)
    .map(module => module.context)

  const rootContext =
    typeof initialContext === 'function'
      ? await initialContext()
      : initialContext

  return reduceAsync(contexts, mergeContext, rootContext)
}

export default combineContexts

async function mergeContext (currentContext, nextContext) {
  const newContext =
    typeof nextContext === 'function'
      ? await nextContext(currentContext)
      : nextContext
  return { ...currentContext, ...newContext }
}
