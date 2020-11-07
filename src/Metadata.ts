export interface Metadata {
  timestamp: Date;
  illust: { [key: string]: Illust };
  user: { [key: string]: User };
}

export interface Illust {
  illustId: string;
  illustTitle: string;
  illustComment: string;
  id: string;
  title: string;
  description: string;
  illustType: number;
  createDate: Date;
  uploadDate: Date;
  restrict: number;
  xRestrict: number;
  sl: number;
  urls: Urls;
  tags: Tags;
  alt: string;
  storableTags: string[];
  userId: string;
  userName: string;
  userAccount: string;
  userIllusts: { [key: string]: ZengoIDWork | null };
  likeData: boolean;
  width: number;
  height: number;
  pageCount: number;
  bookmarkCount: number;
  likeCount: number;
  commentCount: number;
  responseCount: number;
  viewCount: number;
  isHowto: boolean;
  isOriginal: boolean;
  imageResponseOutData: unknown[];
  imageResponseData: unknown[];
  imageResponseCount: number;
  pollData: null;
  seriesNavData: null;
  descriptionBoothId: null;
  descriptionYoutubeId: null;
  comicPromotion: null;
  fanboxPromotion: null;
  contestBanners: unknown[];
  isBookmarkable: boolean;
  bookmarkData: null;
  contestData: null;
  zoneConfig: ZoneConfig;
  extraData: ExtraData;
  titleCaptionTranslation: TitleCaptionTranslation;
  isUnlisted: boolean;
  request: null;
  noLoginData: NoLoginData;
}

export interface ExtraData {
  meta: Meta;
}

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  alternateLanguages: AlternateLanguages;
  descriptionHeader: string;
  ogp: Ogp;
  twitter: Ogp;
}

export interface AlternateLanguages {
  ja: string;
  en: string;
}

export interface Ogp {
  description: string;
  image: string;
  title: string;
  type?: string;
  card?: string;
}

export interface NoLoginData {
  breadcrumbs: Breadcrumbs;
  zengoIdWorks: ZengoIDWork[];
  zengoWorkData: ZengoWorkData;
}

export interface Breadcrumbs {
  successor: unknown[];
  current: Current;
}

export interface Current {
  ja: string;
}

export interface ZengoIDWork {
  id: string;
  title: string;
  illustType: number;
  xRestrict: number;
  restrict: number;
  sl: number;
  url: string;
  description: string;
  tags: string[];
  userId: string;
  userName: string;
  width: number;
  height: number;
  pageCount: number;
  isBookmarkable: boolean;
  bookmarkData: null;
  alt: string;
  isAdContainer: boolean;
  titleCaptionTranslation: TitleCaptionTranslation;
  createDate: Date;
  updateDate: Date;
  isUnlisted: boolean;
  profileImageUrl?: string;
}

export interface TitleCaptionTranslation {
  workTitle: string;
  workCaption: string;
}

export interface ZengoWorkData {
  nextWork: Work;
  prevWork: Work;
}

export interface Work {
  id: string;
  title: string;
}

export interface Tags {
  authorId: string;
  isLocked: boolean;
  tags: Tag[];
  writable: boolean;
}

export interface Tag {
  tag: string;
  locked: boolean;
  deletable: boolean;
  userId?: string;
  userName?: string;
}

export interface Urls {
  mini: string;
  thumb: string;
  small: string;
  regular: string;
  original: string;
}

export interface ZoneConfig {
  responsive: Zone;
  rectangle: Zone;
  "500x500": Zone;
  header: Zone;
  footer: Zone;
  expandedFooter: Zone;
  logo: Zone;
}

export interface Zone {
  url: string;
}

export interface User {
  userId: string;
  name: string;
  image: string;
  imageBig: string;
  premium: boolean;
  isFollowed: boolean;
  isMypixiv: boolean;
  isBlocking: boolean;
  background: Background | null;
  sketchLiveId: null;
  partial: number;
  acceptRequest: boolean;
  sketchLives: unknown[];
}

export interface Background {
  repeat: null;
  color: null;
  url: string;
  isPrivate: boolean;
}
