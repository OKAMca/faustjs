import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { print } from 'graphql';
import type { DocumentNode } from 'graphql';
import isFunction from 'lodash/isFunction.js';
import { SeedNode, SEED_QUERY } from './queries/seedQuery.js';
import { getTemplate } from './getTemplate.js';
import { addApolloState, getApolloClient } from './client.js';
import { getConfig } from './config/index.js';
import { hooks } from './hooks/index.js';

function isSSR(
  ctx: GetServerSidePropsContext | GetStaticPropsContext,
): ctx is GetServerSidePropsContext {
  return (ctx as GetServerSidePropsContext).req !== undefined;
}

export interface WordPressTemplate {
  query:
    | DocumentNode
    | ((seedNode: SeedNode) => DocumentNode)
    | ((seedNode: SeedNode) => Promise<DocumentNode>);
  variables: (seedNode: SeedNode) => { [key: string]: any };
  Component: React.FC<{ [key: string]: any }>;
}

export interface GetWordPressPropsConfig {
  ctx: GetServerSidePropsContext | GetStaticPropsContext;
}

export async function getWordPressProps(options: GetWordPressPropsConfig) {
  const { templates } = getConfig();

  if (!templates) {
    throw new Error('Templates are required. Please add them to your config.');
  }

  const { ctx } = options;

  const client = getApolloClient();

  let resolvedUrl = null;

  if (!isSSR(ctx)) {
    const wordPressNodeParams = ctx.params?.wordpressNode;
    if (wordPressNodeParams && Array.isArray(wordPressNodeParams)) {
      resolvedUrl = `/${wordPressNodeParams.join('/')}`;
    } else {
      resolvedUrl = '/';
    }
  } else {
    resolvedUrl = ctx.req.url;
  }

  if (!resolvedUrl) {
    return {
      notFound: true,
    };
  }

  const seedQuery = hooks.applyFilters('seedQueryDocumentNode', SEED_QUERY, {
    resolvedUrl,
  }) as DocumentNode;

  const seedQueryRes = await client.query({
    query: seedQuery,
    variables: { uri: resolvedUrl },
  });

  const seedNode = seedQueryRes?.data?.node as SeedNode;

  if (!seedNode) {
    return {
      notFound: true,
    };
  }

  const template = getTemplate(seedNode, templates);

  if (!template) {
    return {
      notFound: true,
    };
  }

  const templateQuery = isFunction(template.query)
    ? await template.query(seedNode)
    : template.query;

  if (template.query) {
    await client.query({
      query: templateQuery,
      variables: template?.variables ? template.variables(seedNode) : undefined,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return addApolloState(client, {
    props: {
      __SEED_NODE__: seedNode,
      /**
       * Although the template query is accessible from the client, it must be
       * awaited which can cause loading states on the client for data that
       * has already been fetched and cached. We set the template query as a
       * string so we can immediately get the cached results via useQuery on the
       * client.
       */
      __TEMPLATE_QUERY_STRING__: print(templateQuery),
    },
  });
}
