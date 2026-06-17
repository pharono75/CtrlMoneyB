import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import BalanceCard from '../components/BalanceCard';
import DocumentStats from '../components/Documents/DocumentStats';
import DocumentList from '../components/Documents/DocumentList';

const Documents = () => {
  return (
    <AppLayout>
      <div className="grid grid-cols-12 gap-6 mobile:gap-4 h-[calc(100vh-3rem)] mobile:h-auto pr-2 mobile:pr-0">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 mobile:gap-4 h-full mobile:h-auto overflow-y-auto no-scrollbar pb-2">
          <BalanceCard />
          <DocumentStats />
        </div>

        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6 mobile:gap-4 h-full mobile:h-auto">
          <DocumentList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Documents;
