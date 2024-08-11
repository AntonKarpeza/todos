import React from 'react';
import TodoContent from '../components/TodoContent';
import BaseLayout from './layouts/BaseLayout';

const Home: React.FC = () => (
  <>
    <BaseLayout>
        <TodoContent />
    </BaseLayout>
  </>
);

export default Home;