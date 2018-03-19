import java.net.*;  
import java.io.*;  
class MyServer{  
public static void main(String args[])throws Exception{  
ServerSocket ss=new ServerSocket(3333);  
Socket s=ss.accept();  
DataInputStream din=new DataInputStream(s.getInputStream());  
String str=""; 
while((str=din.readUTF())!=null){  
 
System.out.println("client says: "+str);    
}  
din.close();  
s.close();  
ss.close();  
}}  