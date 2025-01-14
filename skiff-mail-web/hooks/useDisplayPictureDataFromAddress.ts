import { useGetDefaultProfilePictureQuery, useUsersFromEmailAliasQuery } from 'skiff-front-graphql';
import { getContactDisplayPictureData, useGetContactWithEmailAddress } from 'skiff-front-utils';
import { AddressObject } from 'skiff-graphql';
import { isSkiffAddress } from 'skiff-utils';

import client from '../apollo/client';

export const useDisplayPictureWithDefaultFallback = (
  address: string | AddressObject | undefined,
  messageID?: string
) => {
  const displayPictureDataFromAddress = useDisplayPictureDataFromAddress(address);
  const defaultRes = useGetDefaultProfilePictureQuery({
    variables: {
      request: {
        messageID: messageID ?? ''
      }
    },
    skip: !messageID,
    fetchPolicy: 'cache-first'
  });
  let displayPictureData = displayPictureDataFromAddress ?? {};
  let unverified = false;
  if (defaultRes.data?.defaultProfilePicture?.profilePictureData && !displayPictureDataFromAddress) {
    unverified = true;
    displayPictureData = {
      profileCustomURI: defaultRes.data.defaultProfilePicture.profilePictureData
    };
  }
  return { displayPictureData, unverified };
};

export const useDisplayPictureDataFromAddress = (address: string | AddressObject | undefined) => {
  const emailAddress = address ? (typeof address === 'string' ? address : address.address) : undefined;

  // Only Skiff addresses will have profile pictures
  const skipQuery = !emailAddress || !isSkiffAddress(emailAddress, []);
  const { data, error } = useUsersFromEmailAliasQuery({
    variables: {
      emailAliases: emailAddress ? [emailAddress] : []
    },
    skip: skipQuery
  });

  // prioritize contacts displayPictureData
  const contact = useGetContactWithEmailAddress({ emailAddress, client });
  const contactDisplayPictureData = contact ? getContactDisplayPictureData(contact) : undefined;

  if (contactDisplayPictureData) return contactDisplayPictureData;

  if (skipQuery || error || !data?.usersFromEmailAlias.length) {
    return undefined;
  }
  return data.usersFromEmailAlias[0]?.publicData.displayPictureData;
};
