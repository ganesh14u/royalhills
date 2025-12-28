import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuickStatsProps {
  roomNumber: string;
  rentStatus: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({ roomNumber, rentStatus }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Room {roomNumber} Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span>Rent Status:</span>
          <Badge variant={rentStatus === 'overdue' ? 'destructive' : 'secondary'}>
            {rentStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export { QuickStats };