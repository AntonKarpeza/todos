import React from 'react';
import TodosContent from '../components/TodosContent';
import BaseLayout from './layouts/BaseLayout';

const Home: React.FC = () => (
  <>
    <BaseLayout>
        <TodosContent />
    </BaseLayout>
  </>
);

export default Home;