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
    public status: boolean,
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
    public status: boolean = true,
  ) {}
}
