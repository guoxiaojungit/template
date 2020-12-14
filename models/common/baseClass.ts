import { BaseEntity } from 'hoolinks-legion-design/lib/models/BaseEntity'

export class BaseClass {
  static initClass = (propsClass: Object, initData: Object) => {
    Object.keys(initData).forEach(_prop => {
      if (propsClass.hasOwnProperty(_prop) && initData[_prop] !== undefined) {
        propsClass[_prop] = initData[_prop]
      }
    })
  }

  public initClass = (propsClass: Object, initData: Object) => {
    Object.keys(initData).forEach(_prop => {
      if (propsClass.hasOwnProperty(_prop) && initData[_prop] !== undefined) {
        propsClass[_prop] = initData[_prop]
      }
    })
  }
}

export class DmsContainerEntity<T> extends BaseEntity<T> {
    // tslint:disable-next-line: typedef
    constructor(fromService?) {
        super(fromService);

        if (fromService && typeof fromService === 'object') {
            this.message = fromService.message || '';
            this.result = fromService.data;
            this.success = fromService.status === '0' ? true : false;
        }
    }
}