import React from 'react';
import PropTypes from 'prop-types';
import { useNotification } from '@strapi/helper-plugin';
import {
  Dialog,
  //   DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Button,
  Box,
  Icon,
} from '@strapi/design-system';
import styled from 'styled-components';
import { Duplicate, Earth } from '@strapi/icons';
import getTrad from '../../utils/getTrad';

const WrappedButton = styled(Box)`
  svg {
    width: ${({ theme: e }) => e.spaces[6]};
    height: ${({ theme: e }) => e.spaces[6]};
  }
`;
const ModifiedDialogBody = ({ children, icon }) => {
  return (
    <Box paddingTop="8" paddingBottom="8" paddingLeft="6" paddingRight="6">
      <WrappedButton paddingBottom="2">
        <Flex justifyContent="center">{icon}</Flex>
      </WrappedButton>
      <>{children}</>
    </Box>
  );
};

const CopyModal = ({ isOpen, onClose, entity }) => {
  const toggleNotification = useNotification();

  const handleSubmit = async () => {
    console.log('Yes', entity);
    onClose();
  };

  return (
    <Dialog onClose={onClose} title="Confirmation" isOpen={isOpen}>
      <ModifiedDialogBody
        icon={<Icon width={`3rem`} height={`3rem`} as={Earth} />}
      >
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              Are you sure you want to copy to all other languages?
            </Typography>
          </Flex>
        </Flex>
      </ModifiedDialogBody>
      <DialogFooter
        startAction={
          <Button onClick={onClose} variant="tertiary">
            Cancel
          </Button>
        }
        endAction={
          <Button
            onClick={handleSubmit}
            variant="success-light"
            startIcon={<Duplicate />}
          >
            Confirm
          </Button>
        }
      />
    </Dialog>
  );
};

CopyModal.propTypes = {
  entity: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CopyModal;
