package com.fahrulrputra.webview_virtual_gamepad;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {
    private static String gamepadUrl;
    private EditText url;
    private Button btn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        url = (EditText) findViewById(R.id.url);
        btn = (Button) findViewById(R.id.button);
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                MainActivity.setUrl(url.getText().toString());
                startActivity(new Intent(MainActivity.this, Gamepad.class));
            }
        });
    }

    public static String getUrl(){
        return gamepadUrl;
    }

    private static void setUrl(String url)
    {
        gamepadUrl = url;
    }
}