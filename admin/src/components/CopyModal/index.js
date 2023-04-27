import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  //   DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Button,
  Box,
  Icon,
  Loader,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Duplicate, Earth } from '@strapi/icons';
import getTrad from '../../utils/getTrad';

const WrappedButton = styled(Box)`
  svg {
    width: ${({ theme: e }) => e.spaces[6]};
    height: ${({ theme: e }) => e.spaces[6]};
  }
`;
const ModifiedDialogBody = ({ children, icon, isLoading }) => {
  return (
    <Box paddingTop="8" paddingBottom="8" paddingLeft="6" paddingRight="6">
      {!isLoading && (
        <WrappedButton paddingBottom="2">
          <Flex justifyContent="center">{icon}</Flex>
        </WrappedButton>
      )}
      <>{children}</>
    </Box>
  );
};

const CopyModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { formatMessage } = useIntl();

  return (
    <Dialog
      onClose={onClose}
      title={formatMessage({
        id: getTrad('modal.title'),
        defaultMessage: 'Create localizations',
      })}
      isOpen={isOpen}
    >
      <ModifiedDialogBody
        icon={<Icon width={`3rem`} height={`3rem`} as={Earth} />}
        isLoading={isLoading}
      >
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            {isLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              <Typography id="confirm-description">
                {formatMessage({
                  id: getTrad('modal.body'),
                  defaultMessage:
                    'Are you sure you want to copy to all other languages?',
                })}
              </Typography>
            )}
          </Flex>
        </Flex>
      </ModifiedDialogBody>
      <DialogFooter
        startAction={
          <Button onClick={onClose} variant="tertiary" disabled={isLoading}>
            {formatMessage({
              id: getTrad('modal.button.cancel'),
              defaultMessage: 'Cancel',
            })}
          </Button>
        }
        endAction={
          <Button
            onClick={onSubmit}
            variant="success-light"
            startIcon={<Duplicate />}
            disabled={isLoading}
          >
            {formatMessage({
              id: getTrad('modal.button.confirm'),
              defaultMessage: 'Confirm',
            })}
          </Button>
        }
      />
    </Dialog>
  );
};

CopyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CopyModal;
