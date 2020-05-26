export interface IProject {
    id: string;
    auto: boolean;
    timestamp: number;
    organizer: string;
    description: string;
    title: string;
    goal: number;
    amountRaised: number;
}

export interface IAuth {
    username: string;
}

export interface IDonation {
    id?: string;
    amount: number;
    name: string;
    timestamp: number;
}