export enum BannerPosition {
     MAIN = "MAIN",
     SECOND = "SECOND",
     THIRD = "THIRD",
     POPUP = "POPUP",
}

export interface Banner {
     id: string;
     title: string;
     description: string;
     image: string;
     redirectUrl: string;
     position: BannerPosition;
     positionOrder: number;
     isActive: boolean;
     altText: string;
     buttonText: string;
}
