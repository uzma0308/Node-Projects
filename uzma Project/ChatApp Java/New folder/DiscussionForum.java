import java.io.*;
import java.net.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.*;
import java.applet.Applet;  
import java.awt.*;  
import java.awt.Graphics;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;

public class DiscussionForum extends JFrame implements ActionListener, Runnable{
	static Socket conn;
	static DataOutputStream dout;
	JPanel panel,panel2,panel3,panelTextArea;
	JTextField NewMsg;
	JTextArea ChatHistory,ActiveUser;
	JButton Send;
	ImageIcon image;
	JLabel image_cont,liveChat;
	JScrollPane scroll;

        
        @Override
        public void run()
		{

		String str="";

		try{

		DataInputStream din=new DataInputStream(conn.getInputStream()); 
		ChatHistory.setText(str);

		while(true)
		{
			str=din.readUTF();

			if(str.contains("->"))
			{
				System.out.println(str+"\n");
				ActiveUser.append(str+"\n");
				ActiveUser.append("\n");

			}
			else
			{
			   System.out.println(str);
               ChatHistory.append(str);
        	}

		}
	}
	catch(IOException e)
	{}

	}


	public DiscussionForum(Socket conn,DataOutputStream dout,String name) throws UnknownHostException, IOException {

		

    	  Color c=new Color(68, 60, 61);
          Color c1=new Color(156, 40, 33);
		  Color c4=new Color(228,86,82);

            
          Thread t1 =new Thread(this);  
         
          this.conn=conn;
          this.dout=dout;
        
		  panel = new JPanel();
		  panel2= new JPanel();
		  panel3=new JPanel();
		  panelTextArea=new JPanel();

		  liveChat=new JLabel("LIVE CHAT");
		  liveChat.setFont(new Font("Arial Rounded MT Bold", Font.BOLD,18));
		  liveChat.setForeground(Color.white);
		  liveChat.setBounds(160,15,300,20);

		  panel3.setBackground(c);
		  panel3.add(liveChat);
		  panel3.setBounds(20,20,452,52);

		  NewMsg = new JTextField();

		  NewMsg.setFont(new Font("Arial Rounded MT Bold", Font.PLAIN,12));
		  NewMsg.setMargin(new Insets(0,10,0,0));//Margin


		  ActiveUser=new JTextArea();
		  ActiveUser.setBounds(370, 72, 102, 300);
		  ActiveUser.setBackground(c4);
		  ActiveUser.setMargin(new Insets(10,10,10,10));//Margin
		  ActiveUser.setForeground(Color.white);
		  ActiveUser.setFont(new Font("Arial Rounded MT Bold", Font.BOLD,12));
		  ActiveUser.setText("Active Users\n\n");

		  ChatHistory = new JTextArea();
		  Send = new JButton("Send");

		  ChatHistory.setFont(new Font("Arial Rounded MT Bold", Font.PLAIN,12));
		  ChatHistory.setMargin(new Insets(10,10,10,10));//Margin

		  ChatHistory.setBounds(20, 72, 350,300);
		  NewMsg.setBounds(20, 400, 340, 30);
		  Send.setBounds(355, 400, 113, 30);

		  Send.setBackground(c4);
    	  Send.setForeground(Color.white);
    	  Send.addActionListener(this);

          panel.add(panel3);
          panel.add(ChatHistory);
          panel.add(NewMsg);
		  panel.add(Send);
		  panel.add(ActiveUser);
		  panel.setBackground(c1);

		  image = new ImageIcon("chat.png");

          image_cont = new JLabel(image); 

          image_cont.setBounds(0, 0, 500, 454);
        
		  panel2.setBackground(c);
          panel2.add(image_cont);


		  ChatHistory.setText("Connected to Server");

		  panel3.setLayout(null);
		  panel.setLayout(null);

		  this.setTitle(name);
		  this.add(panel);
          this.add(panel2);
          this.setBounds(100,100,1000,500);
          this.setSize(1000,500);
		  this.setVisible(true);
		  this.setLayout(new GridLayout(0,2)); 
		  this.setVisible(true);
		  setDefaultCloseOperation(EXIT_ON_CLOSE);
		  t1.start();
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		// TODO Auto-generated method stub
		if ((e.getSource() == Send) && (NewMsg.getText() != "")) {

			//ChatHistory.setText(ChatHistory.getText() + '\n' + "Me:"
					//+ NewMsg.getText());
			try {
				DataOutputStream dos = new DataOutputStream(
						conn.getOutputStream());
				dos.writeUTF(NewMsg.getText());
			} catch (Exception e1) {
				ChatHistory.setText(ChatHistory.getText() + 'n'
						+ "Message sending fail:Network Error");
				try {
					Thread.sleep(3000);
					System.exit(0);
				} catch (InterruptedException e2) {
					// TODO Auto-generated catch block
					e2.printStackTrace();
				}
			}
			NewMsg.setText("");
		}
	}

	
}

