# timedropper
timedropper is a jQuery UI timepicker. Manage time input fields in a standard form. Focus on the input to open an small interactive timepicker.


[Usage and Examples](http://bit.ly/1MrG1pH)


# Fork features

## use 24 hour format

```
<script>$( "#alarm" ).timeDropper({format24Hours: true});</script>
```
You will see time in 24 hour format on the clock and in the input field.


## set a earliest time border

```
<script>$( "#alarm" ).timeDropper({earliestTime: "08:00"});</script>

```

When a user chooses a time below the limit, then the time is setted to the earliest time. E.g. a if you set the earliestTime option to 08:00 and a user chooses 07:30, then time goes up to 08:00.



## set a latest time border

```
<script>$( "#alarm" ).timeDropper({latestTime: "20:00"});</script>
```

When a user chooses a time above the limit, then the time is setted to the latest time. E.g. a if you set the latestTime option to 20:00 and a user chooses 21:30, then time goes up to 20:00.


