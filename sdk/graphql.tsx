/**
 * @author zhouzhixin
 * @description GraphQL客户端配置文件
 * @date 2025-01-01 20:23
 * 
 * 该文件主要用于:
 * 1. 配置Apollo Client实例
 * 2. 提供Apollo Provider组件包装应用
 * 3. 处理认证token的注入
 */



import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { PropsWithChildren } from 'react';
import { useSession } from '@/ctx';



export const StalinApolloProvider = ({ children }: PropsWithChildren) => {

  const SERVER_URL = 'https://api.xqj.com/graphql';

  const { session } = useSession();


  const client = new ApolloClient({
    uri: SERVER_URL,
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${session}`,
    },
  });

  return <ApolloProvider client={client}>
    {children}
  </ApolloProvider>;
};

