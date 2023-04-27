import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { Duplicate } from '@strapi/icons';
import getTrad from '../../utils/getTrad';

const PreviewButton = ({ onClick }) => {
  const { formatMessage } = useIntl();

  return (
    <Button
      onClick={onClick}
      size="S"
      startIcon={<Duplicate />}
      variant="secondary"
      style={{ width: '100%' }}
    >
      {formatMessage({
        id: getTrad('sidepanel.button.text'),
        defaultMessage: 'Copy to other locales',
      })}
    </Button>
  );
};

PreviewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default memo(PreviewButton);
