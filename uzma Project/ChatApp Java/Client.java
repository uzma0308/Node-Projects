import java.io.*;
import java.net.*;
public class Client
{
public static void main(String ar[]) throws Exception{

String str2;

Socket s=new Socket("localhost",3333);  

DataOutputStream dout=new DataOutputStream(s.getOutputStream());  

 FileReader in = new FileReader("C:\\Users\\jay\\Desktop\\ChatApp Java\\file.txt");
 BufferedReader bf = new BufferedReader(in);

while((str2=bf.readLine())!=null)
{
	System.out.println(str2);  
	dout.writeUTF(str2); 
	dout.flush(); 
}
	    bf.close();    
	    dout.close();  
        s.close();
	
}
}
