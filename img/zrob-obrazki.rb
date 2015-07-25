# 

size=32;

l=1;

(0..6).each{|col|
  (0..7).each{|row|
    puts `convert -extract #{size}x#{size}+#{size*col}+#{size*row} kafle-do-ciecia.png kafel-#{l}.png`
    l=l+1
  }
}
puts "done";
true
