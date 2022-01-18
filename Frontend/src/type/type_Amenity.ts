export default interface IAmenity {
    id: number;
    status: boolean;
    createdDate: number;
    updatedDate: number;
    name: string;
    iconImage: string;
    description: string;
    prominent: boolean;
    favorite: boolean;
    safe: boolean;
    amentityCategory: {
        id: number;
        name: string;
        description: string | null;
    };
    iconImagePath: string;
}
