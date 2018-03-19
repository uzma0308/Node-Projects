import java.io.*;
import java.net.*;
public class ClientSingle extends Thread

{
	static Socket s;
	

	public static void main(String ar[]) throws Exception
	{
		String str="",name="",str2="";

		 s=new Socket("localhost",3333);  

		
		DataOutputStream dout=new DataOutputStream(s.getOutputStream());  
		BufferedReader br=new BufferedReader(new InputStreamReader(System.in));  

		System.out.println("Enter name");
		name=br.readLine();
		dout.writeUTF(name);
  		dout.flush();

  		ClientSingle cs=new ClientSingle();
  		cs.start();



  		System.out.println("Enter data");

		while(!str.equals("stop")){  

		  	str=br.readLine();
		  	//System.out.println(str);
			dout.writeUTF(str);
		  	dout.flush();
			}



	  	dout.close();
	  	br.close();
	  	s.close();
	
	}
}
