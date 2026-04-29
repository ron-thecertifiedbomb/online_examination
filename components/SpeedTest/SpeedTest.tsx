"use client";

import { ToolHeader } from "../shared/ToolHeader/ToolHeader";
import { Panel } from "../shared/Panel/Panel";
import { SpeedGauge } from "./SpeedGauge";
import { SpeedTestActionButton } from "./SpeedTestActionButton";
import { SpeedTestNetworkDetails } from "./SpeedTestNetworkDetails";
import { SpeedTestStats } from "./SpeedTestStats";
import { useSpeedTest } from "./useSpeedTest";

export function SpeedTest() {
    const {
        testing,
        phase,
        displaySpeed,
        results,
        networkData,
        strokeProgress,
        phaseText,
        startFullDiagnostic
    } = useSpeedTest();

    return (
        <div className="w-full max-w-6xl grid gap-4 md:gap-6 lg:grid-cols-[1fr_300px]">
            <Panel as="main" className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 sm:space-y-8">
                <ToolHeader title="Network Analyzer" />

                <SpeedGauge
                    phase={phase}
                    displaySpeed={displaySpeed}
                    strokeProgress={strokeProgress}
                    testing={testing}
                    phaseText={phaseText}
                />

                <SpeedTestStats results={results} />
                <SpeedTestActionButton testing={testing} results={results} onStart={startFullDiagnostic} />
            </Panel>
            <SpeedTestNetworkDetails networkData={networkData} phase={phase} />
        </div>
    );
}