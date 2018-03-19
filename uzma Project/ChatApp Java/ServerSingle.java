import java.io.*;
import java.net.*;
import java.util.*;


public class ServerSingle extends Thread{  

static Socket connectedSocket[]=new Socket[100];
static ArrayList<String> al=new ArrayList<String>();  
static String dataArray[]=new String[1000];
static int dataCount=-1;
static int socketCount=-1;
static Socket socket;
String name="";
static String newMsg;

  public void run() {
    try
    {
      while(true)
   
        {
              DataInputStream din=new DataInputStream(socket.getInputStream()); 
              String str="";

              str=din.readUTF(); 
              str= name+" says : "+str+"\n";
              System.out.println(name+" says : "+str); 
              al.add(str); 
              System.out.println(al.size());
              newMsg = str;
              //dataCount++;
              //dataArray[dataCount]=name+" says : "+str+"\n";
              broadcast();
        }
    }

    catch(IOException e){} 
  }

  static public void broadcast() throws IOException{
    String temp="";

      for(int i=0;i<=socketCount;i++)
          {
              //System.out.println(connectedSocket[i]);  

              DataOutputStream dout=new DataOutputStream(connectedSocket[i].getOutputStream());  

              // String msg="";
              // for(int j=0;j<al.size();j++)
              // {
              //   msg+=al.get(j);
              // }

                dout.writeUTF(newMsg);
                dout.flush(); 
                System.out.println(newMsg);
          } 
  }
 
  public static void main(String[] args) throws Exception {
    

    ServerSocket s = new ServerSocket(3333);

    System.out.println("Server Started");

    try {

      while(true) {
       
        socket = s.accept();
        System.out.println("connectedSocket");
        socketCount++;
        connectedSocket[socketCount]=socket;

        DataInputStream din1=new DataInputStream(socket.getInputStream());

        ServerSingle ss=new ServerSingle();
        ss.name=din1.readUTF();
        System.out.println(ss.name);

        ss.start();
        
      } 
        
    }

    finally {

      s.close();
    }
  } 
}