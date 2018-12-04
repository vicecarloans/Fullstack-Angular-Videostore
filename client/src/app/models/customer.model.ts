export class CustomerModelDropDown {
  constructor(public customers: Array<CustomerModel>) {}
}

export class CustomerModel {
  constructor(
    public _id: string,
    public firstName: string,
    public lastName: string,
    public address: string,
    public city: string,
    public phoneNumber: string,
    public active: boolean,
    public image: string,
    public _customerId?: string,
    
  ) {}
}

export class CustomerPaginationModel {
  constructor(
    public customers: CustomerModel[],
    public offset: number,
    public count: number
  ) {}
}
export class CustomerFormModel {
  constructor(
    public _id: string = "",
    public firstName: string = "",
    public lastName: string = "",
    public address: string = "",
    public city: string = "",
    public phoneNumber: string = "",
    public active: boolean = true,
    public image: any = null
  ) {}
}
