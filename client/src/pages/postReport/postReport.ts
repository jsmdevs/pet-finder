// src/state/reportState.ts

export interface ReportState {
    petId: number | null;
    petName: string;
}

class ReportStore extends EventTarget {
    private state: ReportState = {
        petId: null,
        petName: "",
    };

    get petId() {
        return this.state.petId;
    }

    get petName() {
        return this.state.petName;
    }

    openReport(petId: number, petName: string) {
        this.state = { petId, petName };
        this.notify();
    }

    closeReport() {
        this.state = { petId: null, petName: "" };
        this.notify();
    }

    private notify() {
        this.dispatchEvent(
            new CustomEvent("report-state-changed", { detail: { ...this.state } })
        );
    }
}

export const reportStore = new ReportStore();