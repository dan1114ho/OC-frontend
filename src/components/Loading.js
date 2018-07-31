import React from 'react';
import LoadingGrid from '../components/LoadingGrid';
import { Flex } from 'grid-styled';

const Loading = () => {
  return (
    <div className="Loading">
      <Flex justifyContent={['center', 'center', 'flex-start']} flexWrap="wrap">
        <Flex py={3} w={1} justifyContent="center">
          <LoadingGrid />
        </Flex>
      </Flex>
    </div>
  )
};

export default Loading;
