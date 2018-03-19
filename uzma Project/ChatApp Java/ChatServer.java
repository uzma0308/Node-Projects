
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ChatServer {

    static ServerSocket ss;
    static Socket socket;
    static DataInputStream din;
    static DataOutputStream dout;
    static ArrayList<Client> clientConnected=new ArrayList<Client>(); 
    static private ArrayList allMsg;
    
    static public void SendAllMsg() throws IOException
    {
              try{  dout = new DataOutputStream(socket.getOutputStream()); 
                
                allMsg = (ArrayList<String>)Client.chatMsg.clone();
                String newMsg="";
                 for (Iterator it = allMsg.iterator(); it.hasNext();) { 
                            newMsg=(String) it.next();
                dout.writeUTF(newMsg);
                dout.flush();
                 }
            } catch (IOException ex) {
                Logger.getLogger(Broadcast.class.getName()).log(Level.SEVERE, null, ex);
            }
            
        }
    

    public static void main(String[] args) throws IOException {
        // TODO code application logic here
        ss = new ServerSocket(3333);
        System.out.println("Server Started");
        while (true) {
            socket = ss.accept();
            
            Client c= new Client();
            clientConnected.add(c);
            c.setS(socket);
            din = new DataInputStream(socket.getInputStream());
            c.setName(din.readUTF());
            BroadcastActiveUser activeUser=new BroadcastActiveUser();
            //activeUser.start();
            SendAllMsg();
            ReadMessage rm=new ReadMessage(din,c);
            rm.start();
        }
    }
}

class ReadMessage extends Thread {
    DataInputStream din;
    Client c;
    ReadMessage(DataInputStream din,Client c)
    {
        this.din=din;
        this.c=c;
    }
    @Override
    public void run()
    {
        String str="";
        while(true)
        {
            try {
                str=din.readUTF();
                str = c.getName()+" says : "+str+"\n"; 
                Client.chatMsg.add(str);
                Broadcast b = new Broadcast(str);
                b.start(); // breoadcasting now
                
            } catch (IOException ex) {
                Logger.getLogger(ReadMessage.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
            
        
    }

}

class Client {
    static ArrayList<String> chatMsg=new ArrayList<String>();
    private String name;
    private Socket s;

    public String getName() {
        return name;
    }

    public Socket getS() {
        return s;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setS(Socket s) {
        this.s = s;
    }

}

class Broadcast extends Thread {
    private ArrayList clients;
    private String newMsg;
    Broadcast(String newMsg){
        this.newMsg=newMsg;
        clients = (ArrayList<Object>)ChatServer.clientConnected.clone();
    }
    
    public void run(){
        for (Iterator it = clients.iterator(); it.hasNext();) { 
            Client temp = (Client) it.next();
            DataOutputStream dout; 
            try {
                dout = new DataOutputStream(temp.getS().getOutputStream()); 
                
                dout.writeUTF(newMsg);
                dout.flush();
                System.out.println(newMsg);
                // }
            } catch (IOException ex) {
                Logger.getLogger(Broadcast.class.getName()).log(Level.SEVERE, null, ex);
            }
            
        }
    }
}
class BroadcastActiveUser extends Thread {
    private ArrayList clients;
    BroadcastActiveUser(){
         System.out.println("inside contructor");
        clients = (ArrayList<Object>)ChatServer.clientConnected.clone();
        
        if (!clients.isEmpty()) {
            start();
        }
    }
    @Override
     public void run(){
          System.out.println("inside run");
          for (Iterator it = clients.iterator(); it.hasNext();) { 
            Client temp = (Client) it.next();
            System.out.println(temp);
            DataOutputStream dout; 
            try {
                dout = new DataOutputStream(temp.getS().getOutputStream()); 
                for (Iterator iti = clients.iterator(); iti.hasNext();)
                    {
                        
                        Client temp2 = (Client) iti.next();
                        //System.out.println(temp2);
                        dout.writeUTF("->"+temp2.getName());
                        dout.flush();
                        //System.out.println(temp2.getName());
                }
   
            } catch (IOException ex) {
                Logger.getLogger(Broadcast.class.getName()).log(Level.SEVERE, null, ex);
            }
            
        }
         
     }
     
    
}
