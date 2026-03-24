import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache, ApolloClient, createHttpLink } from '@apollo/client/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideApollo(() => {
      return {
        link: createHttpLink({
          uri: 'http://localhost:8080/graphql',
          credentials: 'include',
        }),
        cache: new InMemoryCache(),
      };
    }),
  ],
};