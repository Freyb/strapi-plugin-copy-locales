import React, { useState } from 'react';
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
  MultiSelectNested,
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

const CopyModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  allLocales,
  existingLocales,
}) => {
  const { formatMessage } = useIntl();
  const [selected, setSelected] = useState([]);

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
              <Box>
                <Box marginBottom="1rem">
                  <Typography id="confirm-description">
                    {formatMessage({
                      id: getTrad('modal.body'),
                      defaultMessage:
                        'Are you sure you want to copy to all other languages?',
                    })}
                  </Typography>
                </Box>
                <MultiSelectNested
                  onClear={() => {
                    setSelected([]);
                  }}
                  value={selected}
                  onChange={setSelected}
                  customizeContent={(values) =>
                    values.length == 0
                      ? formatMessage({
                          id: getTrad('modal.placeholder'),
                          defaultMessage: 'Select locales...',
                        })
                      : values.length <= 8
                      ? values.map((v) => v.toUpperCase()).join(', ')
                      : `${values.length} locales selected`
                  }
                  options={[
                    {
                      label: 'All',
                      children: allLocales.map((l) => ({
                        label: existingLocales.includes(l.code) ? (
                          <Typography variant="omega" fontWeight="bold">
                            {`* Overwrite ${l.name}`}
                          </Typography>
                        ) : (
                          `+ Create ${l.name}`
                        ),
                        value: l.code,
                      })),
                    },
                  ]}
                />
              </Box>
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
            onClick={() => onSubmit(selected)}
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

CopyModal.defaultProps = {
  allLocales: [],
  existingLocales: [],
};

CopyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  allLocales: PropTypes.array,
  existingLocales: PropTypes.array,
};

export default CopyModal;
