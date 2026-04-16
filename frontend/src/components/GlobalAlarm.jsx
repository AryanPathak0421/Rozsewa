import React from 'react';
import { useSocket } from '@/context/SocketContext';
import IncomingRequestModal from '@/modules/provider/components/IncomingRequestModal';

const GlobalAlarm = () => {
    const { incomingRequest, setIncomingRequest } = useSocket();

    if (!incomingRequest) return null;

    return (
        <IncomingRequestModal
            request={incomingRequest}
            onAction={() => setIncomingRequest(null)}
        />
    );
};

export default GlobalAlarm;
