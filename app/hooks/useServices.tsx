import { useState } from 'react';
import { CommandResult } from '../utils/voice-command-parser';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function useServices() {
  const params = useLocalSearchParams();
  const command = params?.command ? (JSON.parse(params.command as string) as CommandResult) : null;
  const [selectedService, setSelectedService] = useState<number | null>(
    command?.service ? parseInt(command.service) : null,
  );
  const router = useRouter();

  const handleContinue = () => {
    if (selectedService) {
      router.push({
        pathname: '/screens/branch-selection',
        params: {
          serviceId: selectedService.toString(),
          command: JSON.stringify(command),
        },
      });
    }
  };

  return {
    router,
    selectedService,
    setSelectedService,
    command,
    handleContinue,
  };
}
