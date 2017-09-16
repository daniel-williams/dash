export const logToElement = function(json: any, selector: string, reset: boolean = false) {
  if(selector) {
    let target = document.querySelector(selector) as HTMLElement;

    if(target) {
      let pre = document.createElement('pre');

      if(reset) {
        target.innerHTML = '';
      }

      pre.innerHTML = JSON.stringify(json || {}, undefined, 2);
      
      target.appendChild(pre);
    }
  }
}

export const clearElement = function(selector: string) {
  if(selector) {
    let target = document.querySelector(selector) as HTMLElement;

    if(target) {
      target.innerHTML = '';
    }
  }
}