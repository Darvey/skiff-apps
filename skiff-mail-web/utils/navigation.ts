import { ParsedUrlQueryInput } from 'querystring';

import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { SystemLabels } from 'skiff-graphql';

import { AppRoutes } from '../constants/route.constants';

export const useNavigate = () => {
  const router = useRouter();

  const navigateToSystemLabel = useCallback(
    /**
     * Use this function to navigate into a system label without triggering a complete rerender
     */
    async (systemLabel: SystemLabels, query?: ParsedUrlQueryInput) => {
      await router.push(
        {
          pathname: '/[systemLabel]',
          query: {
            systemLabel: systemLabel.toLowerCase(),
            ...query
          }
        },
        undefined,
        {
          shallow: true
        }
      );
    },
    [router]
  );

  const navigateToUserLabel = useCallback(
    /**
     * Use this function to navigate into a user label without triggering a complete rerender
     */
    async (userLabel: string) => {
      const encodedUserLabel = encodeURIComponent(userLabel.toLocaleLowerCase());
      await router.push(`${AppRoutes.LABEL}#${encodedUserLabel}`);
    },
    [router]
  );

  const navigateToInbox = useCallback(async () => {
    await navigateToSystemLabel(SystemLabels.Inbox);
  }, [navigateToSystemLabel]);

  const navigateToSearch = useCallback(async () => {
    await router.push(
      {
        pathname: AppRoutes.SEARCH
      },
      undefined,
      {
        shallow: true
      }
    );
  }, [router]);

  return { navigateToSystemLabel, navigateToUserLabel, navigateToInbox, navigateToSearch };
};

/**
 * this function returns the hashtag(#) param in
 * the url.
 * example: localhost:4200/mail/label#someLabel,
 * the hash param would be: `someLabel`
 * @param url the url string
 * @returns the hashtag(#) param in the url.
 */
export const extractHashParamFromURL = (url: string) => {
  return url.split('#')[1];
};
