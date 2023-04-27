import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@strapi/design-system';
import { Duplicate } from '@strapi/icons';

const PreviewButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      size="S"
      startIcon={<Duplicate />}
      variant="secondary"
      style={{ width: '100%' }}
    >
      Copy to other locales
    </Button>
  );
};

PreviewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default memo(PreviewButton);
