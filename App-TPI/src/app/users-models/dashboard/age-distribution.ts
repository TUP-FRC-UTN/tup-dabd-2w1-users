export class AgeRange {
    ageRange: string;
    count: number;
    percentage: number;

    constructor() {
        this.ageRange = '';
        this.count = 0;
        this.percentage = 0;
    }
}

export class AgeStatistic {
    totalUsers: number;
    averageAge: number;
    youngestAge: number;
    oldestAge: number;

    constructor() {
        this.totalUsers = 0;
        this.averageAge = 0;
        this.youngestAge = 0;
        this.oldestAge = 0;
    }
}

export class AgeDistributionResponse {
    distribution: AgeRange[];
    statistics: AgeStatistic;

    constructor() {
        this.distribution = [];
        this.statistics = {
            totalUsers: 0,
            averageAge: 0,
            youngestAge: 0,
            oldestAge: 0
        };
    }
}