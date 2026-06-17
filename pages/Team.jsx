import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import TeamScreen from '../components/Team/TeamScreen';

const Team = () => {
  return (
    <AppLayout>
      <div className="flex flex-col overflow-hidden h-[calc(100vh-3rem)] mobile:h-auto mobile:overflow-visible pr-2 mobile:pr-0">
        <TeamScreen />
      </div>
    </AppLayout>
  );
};

export default Team;
