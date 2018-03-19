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

public class Login implements ActionListener{
    static Socket conn;
	JPanel panel1,panel2,panel3;
	JTextField userName;
	JPasswordField password;
	JFrame window;
	JButton sendName;
	ImageIcon image;
	JLabel image_cont,signIn,userLabel,passLabel;
	static Socket s;
    Login()
    {
    	Color c=new Color(68, 60, 61);
    	Color c1=new Color(156, 40, 33);
    	Color c3=new Color(32, 18, 15);
    	Color c4=new Color(228,86,82);

    	window=new JFrame();

        panel1 = new JPanel();

        panel2=new JPanel();

        panel3=new JPanel();

        signIn=new JLabel("SIGN IN");

        userLabel=new JLabel("USER NAME");

        passLabel=new JLabel("PASSWORD");

		signIn.setFont(new Font("Arial Rounded MT Bold", Font.BOLD,18));

		signIn.setForeground(Color.white);

		userLabel.setForeground(Color.white);

		passLabel.setForeground(Color.white);

        userName=new JTextField(200);

        

        password=new JPasswordField(200);

        sendName=new JButton(new ImageIcon("sign_in.png"));

        panel1.setBackground(c);

        panel3.setBackground(c1);
        

        panel2.setBackground(c3);

    	//sendName.setBackground(c4);
    	sendName.setForeground(Color.white);

         
        image = new ImageIcon("welcome.png");

        image_cont = new JLabel(image); 

        image_cont.setBounds(0, 0, 500, 454);

        
        // userName.setText("jTextField1");

        userName.setBackground(new Color(0, 0, 0, 0));

    	userName.setOpaque(false);  
		 

		userName.setForeground(Color.white);

		// password.setText("jTextField1");

		password.setBackground(new Color(0, 0, 0, 0));
		password.setForeground(Color.white);
		password.setOpaque(false);  

        sendName.addActionListener(this);

		Border greyBorder = BorderFactory.createMatteBorder(0, 0, 2, 0, c3);	
		userName.setBorder(greyBorder);
        password.setBorder(greyBorder);


 		signIn.setBounds(110,30,100,30);
        userLabel.setBounds(50,90,100,25);
 		userName.setBounds(50,110,200,25);
 		passLabel.setBounds(50,160,100,25);
 		password.setBounds(50,180,200,25);
 		sendName.setBounds(50,250,200,25);
 		panel3.setBounds(100,50,300,350);

        panel1.add(image_cont);
        panel3.add(signIn);
		  panel3.add(userLabel);
		  panel3.add(passLabel);
          panel3.add(userName);
          panel3.add(password);
          panel3.add(sendName);

          panel2.add(panel3);
          panel3.setLayout(null);
          panel2.setLayout(null);
		
           window.add(panel1);
           window.add(panel2);
           window.setBounds(100,100,1000,500);
           window.setSize(1000,500);
		   window.setVisible(true);
		
	
		  window.setTitle("Login");
		
		  window.setLayout(new GridLayout(0,2)); 
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        DiscussionForum d;
        DataOutputStream dout;

        String name;

		try
		{

		s=new Socket("localhost",3333);  
			
		dout=new DataOutputStream(s.getOutputStream()); 
		name=userName.getText();
		System.out.println(dout);
		dout.writeUTF(name);

  		dout.flush();


        d = new DiscussionForum(s,dout,name);
        d.setVisible(true);
        window.setVisible(false);
		}
		catch(IOException ex){
			System.out.println("not conncted");
		}
	
          
        
    }
    public static void main(String[] args) throws UnknownHostException, IOException {
       
		
               
                Login l=new Login();
             
               
	}
}
