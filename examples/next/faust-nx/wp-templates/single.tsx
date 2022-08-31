import { gql } from '@apollo/client';
import { SeedNode } from 'faust-nx/dist/cjs/queries/seedQuery';
import { getEnvironmentData } from 'worker_threads';

const Component = (props: any) => {
  if (props.loading) {
    return <>Loading...</>;
  }

  const { title, content } = props.data.post;

  return (
    <>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
};

const query = async (seedNode: SeedNode) => {
  return gql`
    query GetPost($uri: ID!) {
      post(id: $uri, idType: URI) {
        title
        content
      }
    }
  `;
};

const variables = (seedQuery: any) => {
  console.log(seedQuery);

  return {
    uri: seedQuery.uri,
  };
};

export default { Component, variables, query };
