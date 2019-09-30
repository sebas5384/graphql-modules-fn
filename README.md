# GraphQL Modules (fn)

[![npm version](https://img.shields.io/npm/v/graphql-modules-fn.svg?style=flat-square)](https://www.npmjs.com/package/graphql-modules-fn)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/graphql-modules-fn@latest)](https://bundlephobia.com/result?p=graphql-modules-fn)
[![Downloads/week](https://img.shields.io/npm/dw/graphql-modules-fn.svg)](https://bundlephobia.com/result?p=graphql-modules-fn)
[![License](https://img.shields.io/npm/l/graphql-modules-fn.svg)](https://github.com/sebas5384/graphql-modules-fn/blob/master/package.json)
[![build status](https://img.shields.io/travis/sebas5384/graphql-modules-fn/master.svg?style=flat-square)](https://travis-ci.org/sebas5384/graphql-modules-fn)
[![coverage](https://img.shields.io/codecov/c/github/sebas5384/graphql-modules-fn.svg?style=flat-square)](https://codecov.io/github/sebas5384/graphql-modules-fn)

**UNDER HEAVY DEVELOPMENT**

## Motivation

Apollo's GraphQL server supports `modules` which uses plain GraphQL's schema
language allowing developers to separate type definitions and resolvers by **domains**.
This feature should it be separated from Apollo's server so we can
use this concept with other server enabling this feature on the browser with
somehting like [apollo-link-schema](https://www.apollographql.com/docs/link/links/schema).

The (fn) on the name is because it has a more "functional" style than the
[graphql-modules](https://graphql-modules.com).

<details>
  <summary>Why not GraphQL Modules?</summary>

[GraphQL Modules](https://graphql-modules.com) is a very nice battle tested, well documented and complete set of tools. But for some cases it can be an
overhead for a team which just wants to organize their code in modules, no dependency injection or injectable providers.
It has a strong opinion of how to use DI, how to handle context or resolvers
composition. Also it has a more object (class) oriented programming which can
be overwelming for some developers which prefer the functional style.
Not a good option to use GraphQL on the browser since the [@graphql-modules/core@0.6.6](https://bundlephobia.com/result?p=@graphql-modules/core@0.6.6) is
55.7 kB minified + gzipped without the rest of the suite of tools like [@graphql-modules/di@0.6.6](https://bundlephobia.com/result?p=@graphql-modules/di@0.6.6) which needs the **Reflect Metada** api that doesn't exist in the
browser yet.

</details>

## Usage

### Installation

`npm i graphql-modules-fn`

or

`yarn add graphql-modules-fn`

### Example of a simple blog.

<details>
  <summary>File: modules/user.js</summary>

```js
import gql from 'graphql-tag'

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  extend type Query {
    users: [User]!
  }
`

const resolvers = {
  Query: {
    users: (root, args, context) => [
      { id: '1', name: 'Sebas' },
      { id: '2', name: 'Rick' },
      { id: '3', name: 'Morty' },
    ],
  },
}

export default { typeDefs, resolvers }
```

</details>

<details>
  <summary>File: modules/comment.js</summary>

```js
import gql from 'graphql-tag'

const typeDefs = gql`
  type Comment {
    id: ID!
    title: String!
    body: String!
    author: User!
  }

  extend type Content {
    comments: [Comment]!
  }
`

const resolvers = {
  Content: {
    comments: (root, args, context) => [
      {
        id: '1',
        title: 'Proident senectus',
        body: 'Cras varius proident senectus!',
        author: { id: '1', name: 'Sebas' },
      },
      {
        id: '2',
        title: 'Faucibus feugiat pulvinar quam',
        body: 'Consectetur soluta, incidunt semper.',
        author: { id: '2', name: 'Rick' },
      },
    ],
  },
}

export default { typeDefs, resolvers }
```

</details>

<details>
  <summary>File: modules/content.js</summary>

```js
import gql from 'graphql-tag'

const typeDefs = gql`
  type Content {
    id: ID!
    title: String!
    body: String
  }

  extend type User {
    articles: [Content]!
  }
`

const resolvers = {
  User: {
    articles: (root, args, context) => [
      {
        id: '1',
        title: 'Sapiente quidem architecto',
        body:
          'Augue tempora excepteur, cras varius proident senectus minima fuga proident temporibus fuga!',
      },
      {
        id: '2',
        title: 'Fuga curae illum suscipit eget',
        body:
          'Faucibus feugiat pulvinar quam, consectetur soluta, incidunt semper! Nobis ipsum, aliquid excepteur.',
      },
    ],
  },
}

export default { typeDefs, resolvers }
```

</details>

<details>
  <summary>File: createSchema.js</summary>

```js
import { bundle } from 'graphql-modules-fn'

import content from './modules/content'
import user from './modules/user'
import comment from './modules/comment'

const modules = [user, comment, content]

export default function createSchema() {
  return bundle(modules) //=> { schema, context }
}
```

</details>

<details>
  <summary>File: createServer.js</summary>

```js
import { ApolloServer } from 'apollo-server'

import createSchema from './createSchema'

export default async function createServer(port) {
  const { schema, context } = await createSchema()

  return new ApolloServer({ schema, context }).listen(port)
}
```

</details>

<details>
  <summary>File: index.js</summary>

```js
import createServer from './createServer'

const { PORT = 3000 } = process.env

const server = createServer(PORT).then(({ url }) => {
  console.log(`🚀 Server eready at ${url}`)
})
```

</details>

### More examples:

- [Simple blog using Apollo's graphql server](https://github.com/sebas5384/graphql-modules-fn-example)
- [GraphQL on the browser with `apollo-link-schema`](https://codesandbox.io/embed/y3qzmpo4wj).

## Running GraphQL in the browser

All sizes are in `KB`, `MINIFIED` and `GZIPPED`.

### Base modules

- `40.9kb` | graphql
- `3.7kb` | apollo-link-schema
- `984b` | graphql-tag
- `2.5kb` | react-apollo-hooks
- `16kb` | apollo-client
- `9.7kb` | apollo-cache-inmemory

**Bundle size:** `~74kb`.

### GraphQL Modules (fn)

- `1.1kb` | graphql-modules-fn
- `10.3kb` | @apollographql/apollo-tools

**Bundle size:** `~85kb`. Incrementing **~15%** of your bundle size.

<details>
  <summary>Comparing using @graphql-modules/core</summary>

- `55.2kb` | @graphql-modules/core

**Bundle size:** `~129kb`. Incrementing **~74%** of your bundle size.

</details>

## TODO:

- [ ] Add usage of contexts.
- [ ] Start a documentation site.
- [x] Subscriptions support (waiting for PR [#1047](https://github.com/apollographql/apollo-tooling/pull/1047) to be merged).
- [ ] Tests with 100% of converage.
