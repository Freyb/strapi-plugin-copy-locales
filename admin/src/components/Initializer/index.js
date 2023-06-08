/**
 *
 * Initializer
 *
 */

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import useConfig from '../../hooks/useConfig';

const Initializer = ({ setPlugin }) => {
  const { config, isLoading: configIsLoading } = useConfig();
  const ref = useRef();
  ref.current = setPlugin;

  useEffect(() => {
    if (!configIsLoading && !!config) {
      ref.current(pluginId);
    }
  }, [configIsLoading, config]);

  return null;
};

Initializer.propTypes = {
  setPlugin: PropTypes.func.isRequired,
};

export default Initializer;
