export class UserRole {

  public static PLAY_API = 'http://localhost:9000';

	 constructor(
	   public id: number,
	    public user_id: number,
	    public role: String
    	){}
}
