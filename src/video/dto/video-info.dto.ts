import { Transform } from "class-transformer";

export class VideoInfo {
    description: string;
    @Transform((x) => new Date(x.value).toISOString())
    duration: number;
    id: string;
    is_private: boolean;
    thumbnail: string;
    title: string;
    upload_date: Date;
    user_id: string;
}