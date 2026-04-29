'use client'

import EmulatorGrid from '@/components/emulator/EmulatorGrid/EmulatorGrid';
import ScreenContainer from '@/components/shared/ScreenContainer/ScreenContainer';
import SectionHeader from '@/components/shared/SectionHeader/SectionHeader';
import { EMULATORS } from '@/data/lists/emulatorList';


export default function GamesPage() {
    return (
      <ScreenContainer className="pt-16 md:pt-10">
            <SectionHeader
                title="Emulator"
                highlight="Vault"
                // description="Initialize legacy hardware protocols. Optimized for low-latency browser execution."
            />


            <EmulatorGrid emulators={EMULATORS} />

    =
        </ScreenContainer>
    );
}