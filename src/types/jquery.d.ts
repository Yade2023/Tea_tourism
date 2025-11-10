// jQuery Slick 插件類型聲明
declare global {
  interface JQuery {
    slick(options?: Record<string, unknown>): JQuery;
  }
}

export {};