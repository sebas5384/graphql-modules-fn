import { buildServiceDefinition } from '@apollographql/apollo-tools'
import combineContexts from './lib/combineContexts'

/**
 * Bundle modules into
 *
 * @param {array} modules Modules to bundle.
 * @param {object|function|promise} initialContext Initial and global context.
 *
 * @returns {object} `{ schema, context }`
 */
export async function bundle (modules = [], initialContext = {}) {
  // Create schema.
  const { schema, errors } = buildServiceDefinition(modules)

  if (errors && errors.length > 0) {
    throw new Error(errors.map(error => error.message).join('\n\n'))
  }

  const context = await combineContexts(modules, initialContext)

  return { schema, context }
}
