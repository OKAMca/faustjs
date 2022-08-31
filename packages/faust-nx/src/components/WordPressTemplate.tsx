import React, { PropsWithChildren } from 'react';
import { DocumentNode, gql, useQuery } from '@apollo/client';
import isFunction from 'lodash/isFunction.js';
import { getTemplate } from '../getTemplate.js';
import { SeedNode } from '../queries/seedQuery.js';
import { getConfig } from '../config/index.js';

export type WordPressTemplateProps = PropsWithChildren<{
  __SEED_NODE__: SeedNode;
  __TEMPLATE_QUERY_STRING__?: string;
}>;

export function WordPressTemplate(props: WordPressTemplateProps) {
  const { templates } = getConfig();

  if (!templates) {
    throw new Error('Templates are required. Please add them to your config.');
  }

  const {
    __SEED_NODE__: seedNode,
    __TEMPLATE_QUERY_STRING__: templateQueryString,
  } = props;
  const template = getTemplate(seedNode, templates);

  let templateQuery: DocumentNode | undefined;

  if (templateQueryString) {
    templateQuery = gql`
      ${templateQueryString}
    `;
  } else {
    if (isFunction(template?.query)) {
      throw new Error(
        'Template "query" can only be used as a function in SSG/SSR',
      );
    }

    if (template?.query) {
      templateQuery = template?.query;
    }
  }

  /**
   * This code block exists above the !template conditional
   * as React Hooks can not be behind conditionals
   */
  const res = useQuery(templateQuery as DocumentNode, {
    variables: template?.variables ? template?.variables(seedNode) : undefined,
    ssr: true,
    skip: !template?.query,
  });

  if (!template) {
    console.error('No template found');
    return null;
  }

  const { Component } = template;

  const { data, error, loading } = res ?? {};

  return React.cloneElement(
    <Component />,
    { ...props, data, error, loading },
    null,
  );
}
